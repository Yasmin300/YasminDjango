export default function ArticleFormFields({ form, handleChange, errors }) {
    return (
        <>
            <div className="col-md-12 mb-3">
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={form.title}
                    dir="auto"
                    onChange={handleChange}
                />
                {errors.title && <span className="text-danger">{errors.title}</span>}
            </div>
            <div className="col-12 mb-3">
                <label>Body:</label>
                <textarea
                    name="body"
                    className="form-control"
                    rows="20"
                    dir="auto"
                    value={form.body}
                    onChange={handleChange}
                ></textarea>
                {errors.body && <span className="text-danger">{errors.body}</span>}
            </div>
            <div className="col-md-12 mb-3">
                <label>Tags (comma separated):</label>
                <input
                    type="text"
                    name="tags"
                    className="form-control"
                    value={form.tags}
                    onChange={handleChange}
                />
                {errors.tags && <span className="text-danger">{errors.tags}</span>}
            </div>
        </>
    );
}
