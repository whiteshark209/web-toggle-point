jq --raw-output '
  map(.name + " @ " + .version) | 
  flatten[]
' <<< $DETAILS
