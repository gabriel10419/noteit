package org.acme;

import org.acme.model.NoteItem;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@RegisterRestClient(baseUri = "http://localhost:8080/catalog")
public interface MyRemoteService {

    @POST
    @Path("/insertnote")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    NoteItem insertNote(NoteItem note);

    @DELETE
    @Path("/deletenote/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    List<NoteItem> deleteNote(@PathParam("name") String name);

    @GET
    @Path("/listnotes")
    @Produces(MediaType.APPLICATION_JSON)
    List<NoteItem> listNotes();

    @PUT
    @Path("/updatenote/{name}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    List<NoteItem> updateNote(@PathParam("name") String name, NoteItem note);
}
