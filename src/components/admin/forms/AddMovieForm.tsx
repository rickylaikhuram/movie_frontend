import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import instance from "../../../utils/axios";

interface MovieFormData {
  title: string;
  synopsis: string;
  genres: string[];
  releaseYear: string;
  runtime: string;
  language: string;
  country: string;
  director: string;
  cast: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
}

interface MovieFormProps {
  onMovieCreated?: () => void;
  onCancel?: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ onMovieCreated, onCancel }) => {
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    synopsis: "",
    genres: [],
    releaseYear: "",
    runtime: "",
    language: "",
    country: "",
    director: "",
    cast: [],
    posterUrl: "",
    backdropUrl: "",
    trailerUrl: "",
  });

  const [newGenre, setNewGenre] = useState<string>("");
  const [newCastMember, setNewCastMember] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addGenre = (): void => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()],
      }));
    }
    setNewGenre("");
  };

  const removeGenre = (genreToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

  const addCastMember = (): void => {
    if (newCastMember.trim() && !formData.cast.includes(newCastMember.trim())) {
      setFormData((prev) => ({
        ...prev,
        cast: [...prev.cast, newCastMember.trim()],
      }));
      setNewCastMember("");
    }
  };

  const removeCastMember = (castToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      cast: prev.cast.filter((member) => member !== castToRemove),
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Process the form data to match Prisma model types
      const movieData = {
        title: formData.title,
        synopsis: formData.synopsis,
        genres: formData.genres,
        releaseYear: formData.releaseYear || undefined,
        runtime: formData.runtime ? parseInt(formData.runtime) : undefined,
        language: formData.language || undefined,
        country: formData.country || undefined,
        director: formData.director || undefined,
        cast: formData.cast,
        posterUrl: formData.posterUrl || undefined,
        backdropUrl: formData.backdropUrl || undefined,
        trailerUrl: formData.trailerUrl || undefined,
      };

      // Here you would typically make an API call to save the movie
      await instance.post("/api/admin/movies", {movieData});

      console.log("Movie data:", movieData);

      if (onMovieCreated) {
        onMovieCreated();
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      alert("Failed to create movie. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCastMember();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Movie</h2>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Movie title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Year
            </label>
            <input
              type="text"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2023"
              pattern="[0-9]{4}"
            />
          </div>
        </div>

        {/* Synopsis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Synopsis *
          </label>
          <textarea
            name="synopsis"
            value={formData.synopsis}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the movie..."
          />
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genres
          </label>
          <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
            {formData.genres.map((genre: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {genre}
                <button
                  type="button"
                  onClick={() => removeGenre(genre)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGenre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewGenre(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addGenre();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add genre"
            />
            <button
              type="button"
              onClick={addGenre}
              disabled={!newGenre.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Movie Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Runtime (minutes)
            </label>
            <input
              type="number"
              name="runtime"
              value={formData.runtime}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., English"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., United States"
            />
          </div>
        </div>

        {/* Director */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Director
          </label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Director name"
          />
        </div>

        {/* Cast */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cast
          </label>
          <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
            {formData.cast.map((member: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {member}
                <button
                  type="button"
                  onClick={() => removeCastMember(member)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCastMember}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCastMember(e.target.value)
              }
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add cast member"
            />
            <button
              type="button"
              onClick={addCastMember}
              disabled={!newCastMember.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Media URLs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poster URL
            </label>
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backdrop URL
            </label>
            <input
              type="url"
              name="backdropUrl"
              value={formData.backdropUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/backdrop.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trailer URL
            </label>
            <input
              type="url"
              name="trailerUrl"
              value={formData.trailerUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        {/* Preview Section */}
        {(formData.posterUrl || formData.title) && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Preview
            </h3>
            <div className="flex gap-4">
              {formData.posterUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={formData.posterUrl}
                    alt="Movie poster"
                    className="w-24 h-36 object-cover rounded-md"
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-lg">
                  {formData.title || "Movie Title"}
                </h4>
                {formData.releaseYear && (
                  <p className="text-gray-600">({formData.releaseYear})</p>
                )}
                {formData.director && (
                  <p className="text-gray-600">
                    Directed by {formData.director}
                  </p>
                )}
                {formData.runtime && (
                  <p className="text-gray-600">{formData.runtime} minutes</p>
                )}
                {formData.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.genres.map((genre: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                {formData.synopsis && (
                  <p className="text-gray-700 mt-2 text-sm">
                    {formData.synopsis}
                  </p>
                )}
                {formData.cast.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Cast:</strong> {formData.cast.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.title || !formData.synopsis || isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Movie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
