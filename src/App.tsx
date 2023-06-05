import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./NewNote";
import useLocalStorage from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";

export type Note = {
  id: string;
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
}

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
}

export type Tag = {
  id: string;
  label: string;
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const noteWithTags = useMemo(() => {
    return notes.map((note) => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  };

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  return (
    <Container className="my-4">
    <Routes>
      <Route path="/" element={<NoteList />} />
      <Route path="/new" element={<NewNote onSubmit={onCreateNote} 
        onAddTag={addTag} availableTags={tags} />} />
      <Route path="/:id">
        <Route index element={<h1>Show</h1>} />
        <Route path="edit" element={<h1>Edit</h1>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </Container>
  )
}

export default App


//noteWithTags function says: loop through my different notes and for each one of them
//i want you to keep all the info about the notes but i also want you get the tags 
//that have the associated id inside of our note that's being stored

//in onCreateNote function which takes data as the parameter is not rawNoteData 
//but we want to convert this data into rawNote so instead of storing the tag itself
//we just want to extract the ID; what we will do is: instead of passing data as the
//only parameter, we'll add { tags, ...data }