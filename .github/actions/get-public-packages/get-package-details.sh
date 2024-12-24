DETAILS=$(jq 'select(.private !=true) | {name:(.name),shortName:(input_filename | split("/") | .[2]),version:(.version),location:(input_filename)}' $PACKAGES)
if [ -z "$DETAILS" ]; then
  exit 1
fi
jq --null-input --compact-output '[inputs]' <<< $DETAILS
