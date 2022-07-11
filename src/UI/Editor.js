import React, { useState, useEffect, useRef } from 'react';
import TitleBar from './TitleBar';
import { truncateSpaces } from '../Misc';
import { Editor } from '@tinymce/tinymce-react';

export default function PrimaryEditor({ selectedPage, setSelectedPage, parent, setPageRefs }) {

  const currentPage = parent.findPage(selectedPage);
  const initialValue = currentPage?.content;
  const editorRef = useRef(null);

  const [ pageTitle, setPageTitle ] = useState("");

  // auto-focus on empty page
  useEffect(() => {
    if (currentPage?.content.length === 0) editorRef.current.focus();
  }, [currentPage])

  /** 
   * Handles user changing the title text for a page.
   */
  const titleChange = (e) => {
    const newTitle = e.target.value;
    setPageTitle(newTitle);
  }

  /**
   * when user blurs or hits enter, save updated page title
   */
  const saveTitleChange = () => {
    let title = truncateSpaces(pageTitle);
    if (title.length === 0 || (parent.pages.some((page) => page.title === title) && pageTitle !== selectedPage)) {
      setPageTitle(currentPage.title);
      alert((title ? "A page with this title already exists.  Please use a different name." : "A title is required."));
      return;
    };
    currentPage.title = pageTitle;
    setPageRefs(parent.pageRefGen());
    setSelectedPage(pageTitle);
  }

  /** We are not currently utilizing the dirty status tracked in state.
  But we might someday.  For example, if we implement some kind of timeout.
  Various references to dirty status have been commented out.

  const [dirty, setDirty] = useState(false);
  useEffect(() => setDirty(false), [initialValue]); */

  // if user selects a different page, switch to that page's content
  useEffect(() => {
    if (editorRef.current && currentPage) {
      setPageTitle(currentPage.title);
      editorRef.current.setContent((currentPage ? currentPage.content : ""));
      // setDirty(false);
    }
  }, [currentPage, selectedPage]);
  
  const save = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      // setDirty(false);
      editorRef.current.setDirty(false);
      currentPage.content = content;
    }
  };

  const element = document.getElementById("html");
  const isDark = element.classList.contains("dark");
  const [key, setKey] = useState(0);

  const toggleDarkTheme = () => {
    if (selectedPage) save();
    (isDark ? element.classList.remove("dark") : element.classList.add("dark"));
    setKey((prev) => prev + 1);
  }

    return (
      <>
        <div className={(selectedPage ? "" : "hidden") + " w-2/3 h-5/6"} id="editor" key={key}>
          <TitleBar pageTitle={pageTitle} titleChange={titleChange} saveTitleChange={saveTitleChange} />
          <Editor
            tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
            init={{
              width: "100%",
              height: "100%",
              skin: (isDark ? 'oxide-dark' : 'oxide'),
              content_css: (isDark ? 'dark' : 'default'),
              plugins: 'fullscreen',
              toolbar_sticky: true,
              menubar: 'false',
              statusbar: false,
              toolbar: 'bold italic underline strikethrough hr | fontsize | alignleft aligncenter alignright | fullscreen',
              forced_root_block: 'div'}}
            initialValue={initialValue}
            onInit={(evt, editor) => editorRef.current = editor}
            
            // autosave on every change
            // default: onDirty={() => setDirty(true)}
            onDirty={save}
          />
          {/* <button onClick={save} disabled={!dirty}>Save</button> */}
          {/* {dirty && <p>You have unsaved content!</p>} */}
        </div>
        <div onClick={toggleDarkTheme} className="absolute bottom-0 left-4 h-10">Dark Theme</div>
      </>

  );
}