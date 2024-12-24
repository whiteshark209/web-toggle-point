TAG=$([ "$PRE_RELEASE" == "true" ] && echo "--tag=pre-release ")
npm publish $TAG--workspace=$WORKSPACE 2> publish_stderr_digest.log
