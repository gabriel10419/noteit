package org.acme.model;

import java.util.Set;

public class NoteItem {
    private String name;
    private double rating;
    private String status;
    private Set<String> tags;
    private int progress;
    private String imageUrl;

    public NoteItem() {}

    public NoteItem(String name, double rating, String status, Set<String> tags, int progress, String imageUrl) {
        this.name = name;
        this.rating = rating;
        this.status = status;
        this.tags = tags;
        this.progress = progress;
        this.imageUrl = imageUrl;
    }

    // Getters e setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
