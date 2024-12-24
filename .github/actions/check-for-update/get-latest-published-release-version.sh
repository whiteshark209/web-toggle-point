if VERSIONS=$(npm view $NAME versions --silent --json); then
  LATEST=$(
    jq --raw-output '
      [.] | 
      flatten | 
      [.[]|select(contains("-") == false)] | 
      reverse | 
      .[0]
    ' <<< $VERSIONS)
  if [ "$LATEST" != "null" ]
  then
    echo $LATEST
    exit
  fi
fi
  
echo "0.0.0"

