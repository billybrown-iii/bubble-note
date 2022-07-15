import { useState, useEffect } from 'react';
import { truncateSpaces } from '../Misc.js';
import NodeRef from '../Classes/NodeRef.js';
import PageRef from '../Classes/PageRef.js';
import NodeList from './NodeList.js';
import PageList from './PageList.js';
import feather from 'feather-icons';
import MiniButton from './MiniButton.js';

const backIcon = feather.icons["corner-left-up"].toSvg({"stroke-width": 1});
const settingsIcon = feather.icons["settings"].toSvg({"stroke-width": 2, "width": "20px"});
const nodeIcon = feather.icons["cpu"].toSvg({"stroke-width": 1, "width": "20px"});

export default function Sidebar({ path, setPath, parent, pageRefs, setPageRefs, setSelectedPage }){
    const [nodeRefs, setNodeRefs] = useState(parent.nodeRefGen());
    
    // When the parent changes, update displayed nodes/pages.
    // State setter functions are guaranteed to have a stable identity per the docs.
    // Therefore, it's fine to include as a dependency.
    useEffect(() => {
        setNodeRefs(parent.nodeRefGen());
        setPageRefs(parent.pageRefGen());
    }, [parent, setPageRefs])


    /** Adds a temporary placeholder nodeRef, pending naming and confirmation */
    const newNode = () => {
        const newNodeRef = new NodeRef("New Node", [null]);
        setNodeRefs([...nodeRefs, newNodeRef]);
    }

    /**
     * Adds new nodeRef to UI and new node to parent object
     * @param {string} title 
     */
    const addNode = (title) => {
        if (title.length === 0) title = "New Node";
        title = truncateSpaces(title);

        if (parent.nodes.every((node) => node.title !== title)){
            setNodeRefs(nodeRefs.slice(0, nodeRefs.length - 1).concat(new NodeRef(title, parent.path)));
            parent.createChildNode(title);
        } else {
            setNodeRefs(nodeRefs.slice(0, nodeRefs.length - 1));
            alert("use a different name");
        }
    }

    /** Adds a temporary placeholder pageRef. */
    const newPage = () => {
        const newPageRef = new PageRef("New Page", null);
        setPageRefs([...pageRefs, newPageRef]);
    }

    /**
     * Adds new pageRef to UI and new page to parent object.
     * @param {string} title 
     */
    const addPage = (title) => {
        title = truncateSpaces(title);
        // check for dentical page titles in same node
        if (parent.pages.some((page) => page.title === title)){
            setPageRefs(pageRefs.slice(0, pageRefs.length - 1));
            alert("There's already a page with this title.  Please use a different name.");
            return;
        }

        // autoname pages if no name is provided
        if (title.length === 0) {
            let latestPage = 1;
            for (let i = 0; i < pageRefs.length; i++){
                if (pageRefs[i].title === "Page " + latestPage) {
                    latestPage++;
                    i = -1;
                }
            }
            title = "Page " + latestPage;
        }

        setPageRefs(pageRefs.slice(0, pageRefs.length - 1).concat(new PageRef(title, parent.path)));
        parent.createPage(title);
        setSelectedPage(title);
    }

    return (
        // TODO when create new node or page, scroll to comfortably view
        <div id="sidebar" className="h-full w-1/3 overflow-auto border-r-2 border-zinc-500 dark:border-slate-100 select-none">
            <div id="back-button" 
             onClick={() => { 
                setSelectedPage(null);
                if (path.length > 1) setPath(path.slice(0, path.length - 1))
             }}
             className="flex items-center p-4 bg-slate-200 dark:bg-slate-600"
            >
                {(path.length > 1 ? <div className="pb-3" dangerouslySetInnerHTML={{__html: backIcon}}></div> : null)}
                <div className='ml-3 text-lg'>{" " + parent.title}</div>
                
            </div>
            
            <div id="sidebar-btns" className="flex justify-end">
            <div className="ml-4 mr-auto mt-2 h-1"><MiniButton icon={settingsIcon}><span></span></MiniButton></div>
                <div onClick={newNode} id="new-node-btn" className="px-3 border-2 border-r-0 border-zinc-900 dark:border-slate-100">New Node</div>
                <div onClick={newPage} id="new-page-btn" className="px-3 border-2 border-zinc-900 dark:border-slate-100">New Page</div>
            </div>
            
            <div id="sidebar-list" className='pb-10'>
                <NodeList setPath={setPath} setSelectedPage={setSelectedPage} nodeRefs={nodeRefs} addNode={addNode} />
                <hr />
                <PageList pageRefs={pageRefs} addPage={addPage} setSelectedPage={setSelectedPage} />
            </div>

        </div>
    )
}
