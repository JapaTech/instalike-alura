import  'dotenv/config.js';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

export async function  getTodosPost() {
    const db = conexao.db("instalike-alura");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}

export async function createNovoPost(conteudo) {
    const db = conexao.db("instalike-alura");
    const colecao = db.collection("posts");
    return colecao.insertOne(conteudo);
}

export async function updatePost(id, conteudo) {
    const db = conexao.db("instalike-alura");
    const colecao = db.collection("posts");
    const objId = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objId)}, {$set: conteudo} );
}