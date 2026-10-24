#!/usr/bin/env python3
"""The preview server for site/: `npm run serve`, then open http://127.0.0.1:8080/.

The same thing as `python3 -m http.server 8080 --directory site`, with one difference. That command's listen
backlog is five, and a page that asks for a dozen lazy images at once (the device panels under reduced motion,
where every section reveals at load) gets ERR_CONNECTION_RESET on the ones past the fifth. A backlog of 128
takes the burst. Nothing else changes: it serves the folder, read only, on the loopback address.
"""
import functools
import http.server
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'site')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128


http.server.test(
    HandlerClass=functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT),
    ServerClass=Server, port=PORT, bind='127.0.0.1',
)
