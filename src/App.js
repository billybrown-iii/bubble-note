import { useState } from 'react';
import { createDummyHomeNode } from './Classes/Node.js';
import Sidebar from './UI/Sidebar';
import Editor from './UI/Editor';
import './App.css';


const homeNode = createDummyHomeNode();
homeNode.createChildNode("Node 4");
console.log(homeNode);

function App() {
  const [ path, setPath ] = useState(["Home"]);
  const [ selectedPage, setSelectedPage ] = useState(null);
  const parent = homeNode.navObj(path);

    // lift pageRefs state up, since Editor can adjust it by adjusting page title
    const [pageRefs, setPageRefs] = useState(homeNode.pageRefGen());

  return (
    <div className="h-screen bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800">
      {/* <div className=' bg-gradient-to-r from-slate-600'>Hello</div> */}
      <div id="main" className='flex flex-wrap h-full w-full max-w-screen-xl m-auto bg-slate-100 dark:bg-gray-700 text-zinc-900 dark:text-zinc-50'>
        <Sidebar path={path} setPath={setPath} parent={parent} pageRefs={pageRefs} setPageRefs={setPageRefs} setSelectedPage={setSelectedPage}/>
        <Editor selectedPage={selectedPage} setSelectedPage={setSelectedPage} parent={parent} setPageRefs={setPageRefs} />
      </div>
    </div>
  );
}

export default App;
