LATEST=$(
  printf '%s\n%s' $VERSION $LATEST_PUBLISHED_VERSION | 
  sort --version-sort --reverse | 
  head -n 1
)
if [ "$LATEST" == "$LATEST_PUBLISHED_VERSION" ]; then
  exit 1
fi
