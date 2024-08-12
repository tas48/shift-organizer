// database.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.12.0/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDSkXmyZinyg8_S7av2BCwi1Hmje3bOd3I",
    authDomain: "shift-organizer-database.firebaseapp.com",
    projectId: "shift-organizer-database",
    storageBucket: "shift-organizer-database.appspot.com",
    messagingSenderId: "738696465161",
    appId: "1:738696465161:web:554da06864e3b3830fe1d8",
    measurementId: "G-6W7D5MM979"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência à coleção de funcionários
const funcionariosCollection = collection(db, "funcionarios");

// Função para adicionar um novo funcionário
export async function adicionarFuncionario(funcionario) {
    try {
        await addDoc(funcionariosCollection, funcionario);
        console.log("Funcionário adicionado com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar funcionário: ", error);
    }
}

// Função para obter todos os funcionários
export async function obterFuncionarios() {
    try {
        const querySnapshot = await getDocs(funcionariosCollection);
        const funcionarios = [];
        querySnapshot.forEach((doc) => {
            funcionarios.push({ id: doc.id, ...doc.data() });
        });
        return funcionarios;
    } catch (error) {
        console.error("Erro ao obter funcionários: ", error);
    }
}

// Função para atualizar um funcionário
export async function atualizarFuncionario(id, dadosAtualizados) {
    try {
        const funcionarioDoc = doc(db, "funcionarios", id);
        await updateDoc(funcionarioDoc, dadosAtualizados);
        console.log("Funcionário atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar funcionário: ", error);
    }
}

// Função para deletar um funcionário
export async function deletarFuncionario(id) {
    
    try {
        const funcionarioDoc = doc(db, "funcionarios", id);
        await deleteDoc(funcionarioDoc);
        console.log("Funcionário deletado com sucesso!");
    } catch (error) {
        console.error("Erro ao deletar funcionário: ", error);
    }
}


