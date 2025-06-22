package org.acme;

import org.acme.model.NoteItem;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("/catalog")
public class NoteCatalogService {

    private final List<NoteItem> notes = new ArrayList<>();

    @POST
    @Path("/insertnote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertNote(NoteItem note) {
        notes.add(note);
        return Response.status(Response.Status.CREATED).entity(note).build();
    }

    @DELETE
    @Path("/deletenote/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoteItem> deleteNote(@PathParam("name") String name) {
        notes.removeIf(note -> note.getName().equalsIgnoreCase(name));
        return notes;
    }

    @GET
    @Path("/listnotes")
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoteItem> listNotes() {
        return notes;
    }

    @PUT
    @Path("/updatenote/{name}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoteItem> updateNote(@PathParam("name") String name, NoteItem updated) {
        for (NoteItem note : notes) {
            if (note.getName().equalsIgnoreCase(name)) {
                // [CORREÇÃO APLICADA AQUI]
                note.setName(updated.getName());
                note.setRating(updated.getRating());
                note.setStatus(updated.getStatus());
                note.setTags(updated.getTags());
                note.setProgress(updated.getProgress());
                note.setImageUrl(updated.getImageUrl());
                break;
            }
        }
        return notes;
    }
}