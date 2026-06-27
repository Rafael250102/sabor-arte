// Helpers padronizados para respostas HTTP
// Garante consistência no formato de resposta em toda a aplicação

// Resposta de sucesso (200 OK)
export const ok = (body) => {
    return {
        success: true,
        statusCode: 200,
        body
    }
}

// Resposta de recurso não encontrado (404)
export const notFound = (body) => {
    return {
        success: false,
        statusCode: 404, // Corrigido: era 400 (Bad Request), o correto para "não encontrado" é 404
        body: 'Not found'
    }
}

// Resposta de erro interno do servidor (500)
export const serverError = (error) => {
    return {
        success: false,
        statusCode: 500, // Corrigido: era 400 (Bad Request), erros de servidor devem retornar 500
        body: error
    }
}