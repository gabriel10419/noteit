package org.acme;

import org.acme.model.NoteItem;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/notemanagement")
public class NoteManagementResource {

    @Inject
    @RestClient
    MyRemoteService myRemoteService;

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public NoteItem addNote(NoteItem note) {
        return myRemoteService.insertNote(note);
    }

    @DELETE
    @Path("/delete/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoteItem> deleteNote(@PathParam("name") String name) {
        return myRemoteService.deleteNote(name);
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoteItem> getAllNotes() {
        return myRemoteService.listNotes();
    }

    @PUT
    @Path("/update/{name}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoteItem> updateNote(@PathParam("name") String name, NoteItem note) {
        return myRemoteService.updateNote(name, note);
    }
}
