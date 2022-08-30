# Build website.
iex "npm run build"

# Remove source mappings.
Remove-Item -Path .\dist -Recurse -Include *.js.map

# Clean git directory
cd ..\Llama-Airforce-Web-Next
iex "git rm -rf ."

# Move dist to git golder
Move-Item -Path ..\Llama-Airforce\dist\*

# Create new commit & push
iex "git add --all"
iex "git commit -m 'New release'"
iex "git push"