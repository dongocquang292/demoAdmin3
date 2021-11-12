import React from 'react';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
const DocsViewer = () => {
    const docs = [
        { uri: `http://localhost:8080/DoNgocQuang.doc` },
        { uri: `http://localhost:8080/Đỗ_Ngọc_Quang.docx` },
        { uri: `http://localhost:8080/1087762.jpg` }

    ]
    return (
        <div className="App">
            <h1>Sample react-doc-viewer</h1>
            <DocViewer
                pluginRenderers={DocViewerRenderers}
                documents={docs}
                config={{
                    header: {
                        disableHeader: false,
                        disableFileName: false,
                        retainURLParams: false
                    }
                }}
                style={{ height: 500 }}
            />
        </div>

    )
}

export { DocsViewer }