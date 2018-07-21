"use strict";

exports.DATABASE_URL =
    process.env.DATABASE_URL || "mongodb://localhost/blogs-app";

exports.PORT = process.env.PORT || 8080;
// mongoimport --db blogs-app --collection posts --drop --file C:/Users/btan/Projects/blog-api-challenge/blog-database/seed-data.json

//  mongodb://user1:password1@ds145981.mlab.com:45981/blog-api-challenge-db
// mongo ds145981.mlab.com:45981/blog-api-challenge-db -u user1 -p password1
// mongoimport -h ds145981.mlab.com:45981 -d blog-api-challenge-db -c blogs -u user1 -p password1 --file C:/Users/btan/Projects/blog-api-challenge/blog-database/seed-data.json
// mongoimport -h ds145981.mlab.com:45981 -d blog-api-challenge-db -c posts -u user1 -p password1 --file C:/Users/btan/Projects/blog-api-challenge/blog-database/seed-data.json
// exports.TEST_DATABASE_URL =
//     process.env.TEST_DATABASE_URL || "mongodb://localhost/test-blogs-app";