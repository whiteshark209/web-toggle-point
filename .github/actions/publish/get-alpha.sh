if VERSIONS=$(npm view $NAME versions --silent --json); then
  PRE_RELEASES=$(
    jq '
      [.] | 
      flatten | 
      [.[]|select(startswith("'$VERSION'-"))]
    ' <<< $VERSIONS)
  if [ "$PRE_RELEASES" != "[]" ]
  then
    jq --raw-output '
      reverse | 
      .[0]
    ' <<< $PRE_RELEASES |
    grep --only-matching '[^.]*$' |
    awk '{print $1+1}'
    exit
  fi
fi

echo 0
