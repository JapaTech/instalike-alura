import fs from "fs";
import multer from "multer";
import { updatePost, getTodosPost, createNovoPost } from "../models/postModel.js";
import  gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts(req, res) {
    const posts = await getTodosPost();
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    
    try {
        const postCriado = await createNovoPost(novoPost);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro:":"Falha na requisiçãoa"});
    }
}

export async function  uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imageUrl: req.file.originalname,
        alt: ""
    };

    try {
        const imagem = await createNovoPost(novoPost);
        const atulizacaoImagem = `uploads/${imagem.insertedId}.png`;
        fs.renameSync(req.file.path, atulizacaoImagem);
        res.status(200).json(imagem);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro:":"Falha na requisiçãoa"});
    }
}

export async function atualizarPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);
        
        const postAtualizado = {
            imageUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt,
        };

        const postCriado = await updatePost(id, postAtualizado);
        res.status(200).json(postCriado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({"Erro:":"Falha na requisiçãoa"});
    }
}
