# Post a code
curl "http://localhost:3000/api/c" -d 'title=test&type=python&content=print "LMAO"'
{"id":1,"deleteKey":"ee11fd8e5598a1731a10f52403175fdc0ee157b9"}

# Getting the code
curl "http://localhost:3000/api/c/1"
{"title":"test","type":"python","content":"print \"LMAO\""}

# Delete that code
curl -X DELETE "http://localhost:3000/api/c/1?deleteKey=ee11fd8e5598a1731a10f52403175fdc0ee157b9"
{"deleted":true}

# Comment on that code
curl "http://localhost:3000/api/c/1/comment" -d "content=cool story bro"
{"id":1,"deleteKey":"499b12da9124e48a94658acaa0062f55eaf10476"}

# Get all the comments on that code
curl "http://localhost:3000/api/c/1/comment"
[{"id":1,"content":"cool story bro"}]

# Delete the comment
curl -X DELETE "http://localhost:3000/api/c/1/comment/1?deleteKey=499b12da9124e48a94658acaa0062f55eaf10476"
{"deleted":true}
