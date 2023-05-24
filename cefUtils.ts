declare var CefSharp: {
    BindObjectAsync(key: string): Promise<void>;
};

declare var boundAsync: {
    getTextEditorContent(): Promise<string>;
    saveTextEditorContent(content: string): Promise<void>;
};

let cefInitialized = false;

export async function initializeCef() {
    if (typeof CefSharp === 'undefined') {
        throw new Error('Cef is undefined');
    }

    if (!CefSharp || !CefSharp.BindObjectAsync) {
        throw new Error('`BindObjectAsync` is undefined');
    }

    await CefSharp.BindObjectAsync('boundAsync');

    if (!boundAsync) {
        throw new Error('`boundAsync` is undefined');
    }

    cefInitialized = true;
}

export async function getContentFromHost() {
    if (!cefInitialized) {
        throw new Error('Cef not initialized');
    }

    return boundAsync.getTextEditorContent();
}

export async function sendContentToHost(content: string) {
    if (!cefInitialized) {
        throw new Error('Cef not initialized');
    }

    return boundAsync.saveTextEditorContent(content);
}
