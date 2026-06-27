import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import styles from '../../../components/modals/modals.module.css';

// URL base da API — usa variável de ambiente se disponível, senão cai no localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Modal de cadastro e edição de pratos
// Props:
//   open      → controla visibilidade do dialog
//   onClose   → callback para fechar o modal
//   plate     → objeto do prato para edição (null para cadastro de novo prato)
//   onSuccess → callback chamado com mensagem de sucesso após salvar
export default function PlateModal({ open, onClose, plate, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        available: true,
        ingredients: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Determina se o modal está em modo de edição (plate != null) ou cadastro
    const isEditing = !!plate;

    // Preenche o formulário com os dados do prato ao abrir em modo de edição
    useEffect(() => {
        if (plate) {
            // Modo Edição — preenche os campos com os dados existentes
            setFormData({
                name: plate.name || "",
                description: plate.description || "",
                price: plate.price || "",
                category: plate.category || "",
                available: plate.available ?? true,
                // Normaliza ingredients para string separada por vírgula para o input
                ingredients: Array.isArray(plate.ingredients) 
                    ? plate.ingredients.join(", ") 
                    : plate.ingredients || ""
            });

            // Monta a URL completa da imagem para o preview
            if (plate.imgUrl) {
                const fullUrl = plate.imgUrl.startsWith('http') 
                    ? plate.imgUrl 
                    : `${API_URL}${plate.imgUrl}`; // Corrigido: era hardcoded
                setImagePreview(fullUrl);
            } else {
                setImagePreview(null);
            }
            
            setImageFile(null);
        } else {
            // Modo Cadastro — limpa todos os campos
            setFormData({
                name: "", description: "", price: "", category: "", 
                available: true, ingredients: ""
            });
            setImagePreview(null);
            setImageFile(null);
        }
    }, [plate]);

    // Atualiza os campos do formulário, tratando checkbox separadamente
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Armazena o arquivo de imagem selecionado e gera preview local via URL de objeto
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Monta e envia o payload do prato como FormData (necessário para upload de imagem)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Converte a string de ingredientes separada por vírgula para array limpo
        const ingredientsArray = formData.ingredients
            ? formData.ingredients.split(",").map(i => i.trim()).filter(i => i.length > 0)
            : [];

        const platePayload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            available: Boolean(formData.available),
            ingredients: ingredientsArray
        };

        // Usa FormData para suportar upload de arquivo junto com os dados do prato
        const formDataToSend = new FormData();

        Object.keys(platePayload).forEach(key => {
            if (key === 'ingredients') {
                // Envia ingredients como JSON string para o backend parsear corretamente
                formDataToSend.append('ingredients', JSON.stringify(platePayload.ingredients));
            } else {
                formDataToSend.append(key, platePayload[key]);
            }
        });

        // Adiciona o arquivo de imagem apenas se um novo foi selecionado
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }

        try {
            // PUT para edição, POST para cadastro
            const url = isEditing 
                ? `${API_URL}/plates/${plate._id}` // Corrigido: era hardcoded
                : `${API_URL}/plates`;              // Corrigido: era hardcoded

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                body: formDataToSend
                // Sem Content-Type — o browser define automaticamente com o boundary do FormData
            });

            if (response.ok) {
                const successMessage = isEditing 
                    ? "Prato atualizado com sucesso!" 
                    : "Prato cadastrado com sucesso!";
                onSuccess(successMessage);
            } else {
                alert("Erro ao salvar o prato.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão com o servidor.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <div className={styles.modalContent}>
                <h2>{isEditing ? "Editar Prato" : "Novo Prato"}</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div>
                            <label>Nome do Prato</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Categoria</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Preço (R$)</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Upload de imagem com preview */}
                    <div>
                        <label>Imagem do Prato</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                        />
                        {/* Preview da imagem — exibe tanto a existente (edição) quanto a nova (upload) */}
                        {imagePreview && (
                            <div style={{ marginTop: '12px' }}>
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    style={{ 
                                        width: '240px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ddd' 
                                    }} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Textarea de descrição — ocupa largura total */}
                    <div className={styles.descriptionContainer}>
                        <label>Descrição</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange}
                            className={styles.descriptionTextarea}
                            rows={6}
                            required
                        />
                    </div>

                    {/* Campo de ingredientes — separados por vírgula, convertidos para array no submit */}
                    <div className={styles.ingredientsContainer}>
                        <label>Ingredientes (separados por vírgula)</label>
                        <input 
                            type="text" 
                            name="ingredients" 
                            value={formData.ingredients} 
                            onChange={handleChange}
                            className={styles.ingredientsInput}
                            placeholder="Ex: Tomate, Mussarela, Manjericão"
                        />
                    </div>

                    {/* Checkbox de disponibilidade para venda */}
                    <div className={styles.checkbox}>
                        <input 
                            type="checkbox" 
                            name="available" 
                            checked={formData.available} 
                            onChange={handleChange} 
                        />
                        <label>Prato disponível para venda</label>
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" className={styles.saveBtn}>
                            {isEditing ? "Salvar Alterações" : "Cadastrar Prato"}
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
