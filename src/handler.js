const { nanoid } = require("nanoid");
const books = require("./books");

// POST BOOK
const addBooks = (request, h) => {
    const {name, year, author, summary, publisher, 
        pageCount, readPage, reading} = request.payload;

        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage;

        const newBook = {
            id, name, year, author, summary, publisher, pageCount,
            readPage, finished, reading, insertedAt, updatedAt
        };

        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        if(name === undefined){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if(isSuccess){
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        }

        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
};

// GET ALL BOOKS
const getAllBooks = (request, h) => {
    const {name, reading, finished} = request.query;
    if (name){
        const filteredBook = books.filter(book => {
            return book.name.toLowerCase().includes(name.toLowerCase())
        })
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBook.map(bk => ({
                    id: bk.id,
                    name: bk.name,
                    publisher: bk.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    } else if (reading){
        const isReading = reading === 1;
        const filteredBook = books.filter((book) => book.reading === isReading);
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBook.map(bk => ({
                    id: bk.id,
                    name: bk.name,
                    publisher: bk.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    } else if (finished){
        const isFinished = finished === 1;
        const filteredBook = books.filter((book) => book.finished === isFinished);
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBook.map(bk => ({
                    id: bk.id,
                    name: bk.name,
                    publisher: bk.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map(bk => ({
                    id: bk.id,
                    name: bk.name,
                    publisher: bk.publisher,
                }))
            }
        })
        response.code(200);
        return response;
    }
}

// GET BOOK BY ID
const getBookById = (request, h) => {
    const {bookId} = request.params;

    const book = books.filter((b) => b.id === bookId)[0];
    if (book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

// PUT/EDIT BOOK BY ID
const editBookById = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, 
        pageCount, readPage, reading} = request.payload;
    
    const updatedAt = new Date().toISOString();

    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (name == undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id == bookId);
    if (index !== -1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

// DELETE BOOK BY ID
const deleteBookById = (request, h) => {
    const {bookId} = request.params;
    
    const index = books.findIndex((book) => book.id == bookId);
    if (index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}



module.exports = {addBooks, getAllBooks, getBookById, editBookById, deleteBookById};