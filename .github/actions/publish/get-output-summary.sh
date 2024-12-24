cat publish_stderr_digest.log |
grep 'npm notice' |
tail -n +2 |
cut -c 12-
