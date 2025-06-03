import nbformat
import json

try:
    # Read the notebook with UTF-8 encoding
    with open('E:/VS Code Programs/Projects/Web Dev Projects/BotMed/backend/Notebooks/Main Backend/whisper_aud_text (1).ipynb', 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)
    
    # Remove widget metadata
    if 'widgets' in nb.metadata:
        del nb.metadata['widgets']
        print("Removed widget metadata")
    else:
        print("No widget metadata found")
    
    # Save the cleaned notebook with UTF-8 encoding
    with open('whisper_aud_text_fixed.ipynb', 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)
        
    print("Fixed notebook saved as whisper_aud_text_fixed.ipynb")
    
except UnicodeDecodeError:
    print("Trying alternative encoding fix...")
    # Alternative method using JSON directly
    try:
        with open('E:/VS Code Programs/Projects/Web Dev Projects/BotMed/backend/Notebooks/Main Backend/whisper_aud_text (1).ipynb', 'r', encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
        
        if 'widgets' in data.get('metadata', {}):
            del data['metadata']['widgets']
            print("Removed widget metadata")
        
        with open('whisper_aud_text_fixed.ipynb', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print("Fixed notebook saved as whisper_aud_text_fixed.ipynb")
        
    except Exception as e2:
        print(f"Alternative method failed: {e2}")
        
except Exception as e:
    print(f"Error: {e}")