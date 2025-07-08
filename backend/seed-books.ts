import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  { title: "Dom Casmurro", author: "Machado de Assis" },
  { title: "O Cortiço", author: "Aluísio Azevedo" },
  { title: "O Guarani", author: "José de Alencar" },
  { title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis" },
  { title: "Iracema", author: "José de Alencar" },
  { title: "A Moreninha", author: "Joaquim Manuel de Macedo" },
  { title: "O Ateneu", author: "Raul Pompéia" },
  { title: "Casa Grande & Senzala", author: "Gilberto Freyre" },
  { title: "Vidas Secas", author: "Graciliano Ramos" },
  { title: "Capitães da Areia", author: "Jorge Amado" },
  { title: "O Auto da Compadecida", author: "Ariano Suassuna" },
  { title: "Grande Sertão: Veredas", author: "João Guimarães Rosa" },
  { title: "Macunaíma", author: "Mário de Andrade" },
  { title: "São Bernardo", author: "Graciliano Ramos" },
  { title: "O Quinze", author: "Rachel de Queiroz" },
  { title: "Dona Flor e Seus Dois Maridos", author: "Jorge Amado" },
  { title: "A Hora da Estrela", author: "Clarice Lispector" },
  { title: "Cidade de Deus", author: "Paulo Lins" },
  { title: "O Vendedor de Sonhos", author: "Augusto Cury" },
  { title: "Caim", author: "José Saramago" },
];

async function seedBooks() {
  console.log("Iniciando cadastro de livros...");

  try {
    for (const book of books) {
      // Verifica se o livro já existe
      const existingBook = await prisma.book.findFirst({
        where: {
          AND: [{ title: book.title }, { author: book.author }],
        },
      });

      if (!existingBook) {
        await prisma.book.create({
          data: book,
        });
        console.log(`✓ Livro cadastrado: "${book.title}" por ${book.author}`);
      } else {
        console.log(`- Livro já existe: "${book.title}" por ${book.author}`);
      }
    }

    console.log("Cadastro de livros concluído!");

    // Mostra estatísticas
    const totalBooks = await prisma.book.count();
    console.log(`Total de livros no banco: ${totalBooks}`);
  } catch (error) {
    console.error("Erro ao cadastrar livros:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBooks();
