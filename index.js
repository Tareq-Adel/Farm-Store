const http = require("http");
const url = require("url");
const fs = require("fs");

function replaceTemplate(temp, product) {
	let result = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	result = result.replace(/{%PRICE%}/g, product.price);
	result = result.replace(/{%IMAGE%}/g, product.image);
	result = result.replace(/{%QUANTITY%}/g, product.quantity);
	result = result.replace(/{%ID%}/g, product.id);
	result = result.replace(/{%FROM%}/g, product.from);
	result = result.replace(/{%NUTRIENTS%}/g, product.nutrients);
	result = result.replace(/{%DESCRIPTION%}/g, product.description);

	if (!product.organic) {
		result = result.replace(/{%NOT_ORGANIC%}/g, "not-organic");
	}
	return result;
}

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8"
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8"
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	console.log(req.url);
	console.log("=-=-=-=-=-=-=-=-=-=-=---=");
	console.log(url.parse(req.url, true));

	const { query, pathname } = url.parse(req.url, true);
	// Overview Page
	if (pathname == "/" || pathname == "/overview") {
		const cardsHtml = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join(" ");

		const result = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
		res.writeHead(200, { "Content-type": "text/html" });
		res.end(result);

		// Product Page
	} else if (pathname == "/product") {
		let result = replaceTemplate(tempProduct, dataObj[query.id]);

		res.writeHead(200, {
			"content-type": "text/html",
		});
		res.end(result);
	} else if (pathname == "/api") {
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);
	} else {
		res.writeHead(404, {
			"Content-type": "text/html",
		});
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
