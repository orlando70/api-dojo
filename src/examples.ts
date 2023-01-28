export const example1 = `Title: string

Thread 🧵👇
📌 What is cURL?

cURL is a command-line program for transferring data via many protocols, including HTTP and HTTPS. It is frequently employed to test and troubleshoot APIs. 

Here are some examples of how to access and test APIs using cURL
1️⃣ Making a GET request to an API
curl -X GET https://api.example.com/users
2️⃣ Making a POST request with JSON data
curl -X POST -H "Content-Type: application/json"
-d '{"name":"John Doe"}
https://api.example.com/users
3️⃣ Adding an API key to the request
curl -X GET -H 'Authorization: Bearer YOUR-API-KEY'
https://api.example.com/users
4️⃣ Saving the response to a file
curl -X GET https://api.example.com/users
users.json
5️⃣ Request with basic auth
curl -u "username:password"
https://api.example.com/users
6️⃣ Request with OAuth token
curl -H 'Authorization: Bearer YOUR-OAUTH-TOKEN'
https://api.example.com/users
Additional options include:

--compressed - requesting and receiving compressed data

-i - display the headers in the response

-v - display more information about the request and response.
Thanks for reading!

Follow us 
@api_dojo
 for more exclusive content. 🐙💙
`

export const example2 = `Improve performance of your APIs.

A thread 🧵👇
We can use HTTP compression to reduce the size of API requests and responses.

It is used by APIs that deliver large data to many clients.

By utilizing compression, bandwidth usage can be significantly reduced, resulting in improved speed and performance for your API.
It utilizes a range of algorithms to compress the payload.

Its formats vary from general-purpose compression (e.g., gzip) to specialized compression algorithms designed for specific uses such as 'text/html' or 'image/svg'.
Compression can be implemented using libraries and extensions.

Examples include mod_deflate in Apache or Gzip-js in JavaScript.
📌 How does it work?

When making a request, the client sends an 'Accept-Encoding' header to the server. 

This header informs the server about the compression algorithms client understands.

For example, 'Accept-Encoding: gzip' means the client understands gzip.
If the server understands the requested algorithm, it compresses the data using it.

Once compressed, the server sends the response with a header specifying the algorithm used.

For example, 'Content-Encoding: gzip' shows that the content is compressed using gzip.
We hope you found this helpful! 

Follow 
@api-dojo
 for more of our exclusive content. 🐙`

