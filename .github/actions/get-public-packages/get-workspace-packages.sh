WORKSPACES=$(jq .workspaces ./package.json)
if [ -z "$WORKSPACES" ]; then
  exit 1
fi
jq --raw-output '
  map("./" + . + "/package.json") | 
  join(" ")
' <<< $WORKSPACES
