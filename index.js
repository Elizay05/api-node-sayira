const exp = require("express");
const mongoose = require('mongoose');
const logger = require("morgan");
require('dotenv').config();

const router = require('./backend/router/router');

const express = require('express');
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

const path = require('path')
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/frontend/views'));

app.use(express.static('./frontend/public'));
app.get("/checkout", async (req, res) => {
    res.render('pages/checkout')
  });