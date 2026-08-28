#!/usr/bin/env bash
# One-shot SEO setup for emenla.com. Safe to re-run: every step checks first and
# skips work that is already done. Never prints the token.
#
#   export CLOUDFLARE_API_TOKEN=...      # see the token recipe printed on failure
#   bash setup-seo.sh
#
# Does two things:
#   1. deploys site/ to the Worker (only if the live site is behind the repo)
#   2. adds the www -> apex 301 as a Cloudflare Redirect Rule, appending to the
#      dynamic-redirect phase instead of overwriting whatever else lives there.
#      It cannot go in site/_redirects: absolute sources are rejected at deploy
#      time with "Only relative URLs are allowed" (code 100324).
set -uo pipefail

APEX=emenla.com
WWW=www.emenla.com
# Run from the repo root, or point EMENLA_REPO at it.
REPO="${EMENLA_REPO:-$PWD}"
API=https://api.cloudflare.com/client/v4
ok=0; fail=0

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
pass() { printf '  \033[32mOK\033[0m    %s\n' "$*"; ok=$((ok+1)); }
warn() { printf '  \033[33mSKIP\033[0m  %s\n' "$*"; }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; fail=$((fail+1)); }

cf() { # cf METHOD PATH [BODY]
  local m=$1 p=$2 b=${3:-}
  if [ -n "$b" ]; then
    curl -sS -X "$m" "$API$p" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" --data "$b"
  else
    curl -sS -X "$m" "$API$p" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  fi
}

jq_get() { python3 -c "import sys,json;d=json.load(sys.stdin);print(eval(sys.argv[1],{'d':d}) or '')" "$1" 2>/dev/null; }

# ---------------------------------------------------------------- token check
say "0. Cloudflare token"
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  cat <<'RECIPE'
  CLOUDFLARE_API_TOKEN is not set.

  Create one at https://dash.cloudflare.com/profile/api-tokens -> Create Token
  -> Custom token, with exactly these three permissions and nothing more:

      Account | Workers Scripts        | Edit     (to deploy)
      Zone    | Zone                   | Read     (to find the zone id)
      Zone    | Dynamic Redirect       | Edit     (to add the www rule)

    Zone Resources: Include -> Specific zone -> emenla.com

  Then:  export CLOUDFLARE_API_TOKEN=...   &&   bash setup-seo.sh
RECIPE
  exit 1
fi

json_ok() { python3 -c "
import sys,json
try: sys.exit(0 if json.load(sys.stdin).get('success') is True else 1)
except Exception: sys.exit(1)"; }

verify=$(cf GET /user/tokens/verify)
if echo "$verify" | json_ok; then
  pass "token is valid and active"
else
  bad "token rejected by Cloudflare"; echo "$verify" | head -3; exit 1
fi

# ------------------------------------------------------------------- zone id
say "1. Zone lookup"
ZONE=$(cf GET "/zones?name=$APEX" | jq_get "d['result'][0]['id'] if d.get('result') else ''")
if [ -z "$ZONE" ]; then
  bad "no zone for $APEX on this token (check Zone:Read and Zone Resources)"; exit 1
fi
pass "zone $APEX -> ${ZONE:0:8}..."

# -------------------------------------------------------------------- deploy
say "2. Deploy"
LIVE_HAS_SCHEMA=$(curl -s --max-time 20 "https://$APEX/" | grep -c '"@type": "WebSite"' || true)
if [ "$LIVE_HAS_SCHEMA" -ge 1 ]; then
  warn "live site already carries the new entity graph, nothing to deploy"
else
  if [ -f "$REPO/wrangler.jsonc" ]; then
    ( cd "$REPO" && npx --yes wrangler deploy ) && pass "deployed" || bad "wrangler deploy failed"
  else
    bad "no wrangler.jsonc in $REPO -- run this from the repo root, or set EMENLA_REPO=/path/to/Emenla-Website"
  fi
fi

# ------------------------------------------------------- www -> apex 301 rule
say "3. Redirect rule: $WWW -> $APEX"
PHASE=/zones/$ZONE/rulesets/phases/http_request_dynamic_redirect/entrypoint
existing=$(cf GET "$PHASE")

already=$(echo "$existing" | python3 -c "
import sys,json
try: d=json.load(sys.stdin)
except Exception: print('0'); raise SystemExit
rs=(d.get('result') or {}).get('rules') or []
print('1' if any('$WWW' in (r.get('expression') or '') for r in rs) else '0')")

if [ "$already" = "1" ]; then
  warn "a rule for $WWW already exists, leaving it alone"
else
  BODY=$(python3 -c "
import sys,json
try: d=json.load(sys.stdin); rules=(d.get('result') or {}).get('rules') or []
except Exception: rules=[]
# keep every rule already in this phase, then append ours
keep=[{k:v for k,v in r.items() if k in ('action','action_parameters','expression','description','enabled','ref')} for r in rules]
keep.append({
  'action':'redirect',
  'action_parameters':{'from_value':{
     'status_code':301,
     'target_url':{'expression':'concat(\"https://$APEX\", http.request.uri.path)'},
     'preserve_query_string':True}},
  'expression':'(http.host eq \"$WWW\")',
  'description':'www to apex, one hostname for search engines',
  'enabled':True})
print(json.dumps({'rules':keep}))" <<<"$existing")

  res=$(cf PUT "$PHASE" "$BODY")
  if echo "$res" | json_ok; then
    pass "301 rule created (appended, existing rules preserved)"
  else
    bad "could not create the rule"; echo "$res" | python3 -m json.tool 2>/dev/null | head -20
  fi
fi

# -------------------------------------------------------------- verification
say "4. Verification"
sleep 3
code_www=$(curl -sI --max-time 20 "https://$WWW/"  | head -1 | awk '{print $2}')
code_apex=$(curl -sI --max-time 20 "https://$APEX/" | head -1 | awk '{print $2}')
[ "$code_www"  = "301" ] && pass "$WWW -> 301" || bad "$WWW returned $code_www, expected 301"
[ "$code_apex" = "200" ] && pass "$APEX -> 200" || bad "$APEX returned $code_apex, expected 200"

target=$(curl -sI --max-time 20 "https://$WWW/" | tr -d '\r' | awk 'tolower($1)=="location:"{print $2}')
[ "$target" = "https://$APEX/" ] && pass "redirect target is https://$APEX/" || bad "redirect target is '$target'"

schema=$(curl -s --max-time 20 "https://$APEX/" | grep -c '"@type": "WebSite"' || true)
[ "$schema" -ge 1 ] && pass "entity graph is live" || bad "entity graph not live yet"

h1=$(curl -s --max-time 20 "https://$APEX/" | grep -c '<h1' || true)
[ "$h1" = "1" ] && pass "exactly one h1" || bad "$h1 h1 elements, expected 1"

sm=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "https://$APEX/sitemap.xml")
[ "$sm" = "200" ] && pass "sitemap.xml reachable" || bad "sitemap.xml returned $sm"

say "Done: $ok passed, $fail failed"
if [ "$fail" -eq 0 ]; then
  cat <<'NEXT'

  Cloudflare side is finished. Two things only you can do:

  1. Search Console  https://search.google.com/search-console
       Sitemaps -> submit  sitemap.xml
       URL Inspection -> Request indexing, for each of:
         https://emenla.com/   /science/   /privacy/   /terms/
       There is no API for Request indexing. It has to be clicked.

  2. Instagram @emenla.health -> Edit profile -> Website field -> https://emenla.com
       The link field, not the bio text. This is the backlink that
       teaches Google "emenla" is a name, not a typo for "emla".
NEXT
fi
exit $(( fail > 0 ))
