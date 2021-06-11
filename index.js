const express = require("express");
const pool = require("./db");
const path = require("path");
const app = express();
require("dotenv/config");
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

//fileupload
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ID,
	secretAccessKey: process.env.AWS_SECRET,
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_BUCKET_NAME,
		acl: "public-read",
		cacheControl: "max-age=31536000",
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, Date.now().toString() + ".pdf");
		},
	}),
});

app.post("/upload", upload.single("pdf"), function (req, res, next) {
	res.send(req.file);
});

app.post("/submitform", async (req, res) => {
	try {
		const form = req.body;
		console.log(form);
		const pers = await pool.query(
			"INSERT INTO personal (firstname,lastname,preferredname,email,phonenumber,address,city,province,websiteone,websitetwo,websitethree,resumelink,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
			[
				form.firstName,
				form.lastName,
				form.prefName,
				form.email,
				form.phonenumber,
				form.address,
				form.city,
				form.province,
				form.web1,
				form.web2,
				form.web3,
				form.resumelink,
				"active",
			]
		);
		const resp = pers.rows[0];
		res.json(resp);
		for (let i = 0; i < Object.keys(form.edu).length; i++) {
			await pool.query(
				"INSERT INTO education (personid,instname,startdate,enddate,degree,major,minor,other) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
				[
					resp.personid,
					form.edu[i].InstName,
					form.edu[i].startSchool,
					form.edu[i].endSchool,
					form.edu[i].degree,
					form.edu[i].major,
					form.edu[i].minor,
					form.edu[i].other,
				]
			);
		}
		for (let i = 0; i < Object.keys(form.exp).length; i++) {
			await pool.query(
				"INSERT INTO experience (personid,companyname,position,startdate,enddate,description,city,province) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
				[
					resp.personid,
					form.exp[i].company,
					form.exp[i].position,
					form.exp[i].startDate,
					form.exp[i].endDate,
					form.exp[i].description,
					form.exp[i].city,
					form.exp[i].province,
				]
			);
		}
		await pool.query(
			"INSERT INTO skill (personid,skillname) VALUES($1,$2) RETURNING *",
			[resp.personid, form.skills]
		);
	} catch (err) {
		console.error(err.message);
	}
});

app.get("/admin/:searchTerm", async (req, res) => {
	try {
		// console.log(req)
		const { searchTerm } = req.params;
		const applicant = await pool.query(
			"SELECT * FROM personal WHERE email = $1",
			[searchTerm]
		);
		console.log(applicant.rows);
		res.json(applicant.rows);
	} catch (err) {
		console.error(err.message);
	}
});

app.delete("/admin/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM personal WHERE personid = $1", [id]);
		res.json("Application deleted");
	} catch (err) {
		console.error(err.message);
	}
});

app.put("/admin/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query(
			"UPDATE personal SET status = CASE WHEN (status = 'active') THEN 'hidden' WHEN (status = 'hidden') THEN 'active' END WHERE personid = $1",
			[id]
		);
		res.json("Application status changed");
	} catch (err) {
		console.error(err.message);
	}
});

app.get("/check/:email", async (req, res) => {
	try {
		// console.log(req)
		const { email } = req.params;
		const applicant = await pool.query(
			"SELECT count(*) FROM personal WHERE email = $1",
			[email]
		);
		const checkbool = applicant.rows[0].count;
		let resp = false;
		if (checkbool > 0) {
			resp = true;
		}
		res.json(resp);
	} catch (err) {
		console.error(err.message);
	}
});

app.get("/registerdecisions", async (req, res) => {
	try {
		const allRegs = await pool.query(
			"SELECT * FROM users WHERE user_role = 'unverified'"
		);
		res.json(allRegs.rows);
	} catch (err) {
		console.error(err.message);
	}
});

app.delete("/registerdecisions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
		res.json("User deleted");
	} catch (err) {
		console.error(err.message);
	}
});

app.put("/registerdecisions/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await pool.query(
			"UPDATE users SET user_role = 'verified' WHERE user_id = $1",[id]);
		res.json("User Account activated");
	} catch (err) {
		console.error(err.message);
	}
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
}

app.listen(PORT, () => {
	console.log(`server at port ${PORT}`);
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./client/public/index.html"));
});
