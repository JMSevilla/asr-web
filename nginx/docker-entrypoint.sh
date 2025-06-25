#!/usr/bin/env sh
set -eu

envsubst '${OPENAM_BASEURL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"