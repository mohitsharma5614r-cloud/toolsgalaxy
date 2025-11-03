
interface Base64ConversionResult {
    base64: string;
    mimeType: string;
}

export const fileToBase64 = (file: File): Promise<Base64ConversionResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // The result is a data URL like "data:image/png;base64,iVBORw0KGgo..."
            // We need to extract just the base64 part.
            const base64 = result.split(',')[1];
            if (base64) {
                 resolve({ base64, mimeType: file.type });
            } else {
                reject(new Error("Failed to extract Base64 string from file."));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};
