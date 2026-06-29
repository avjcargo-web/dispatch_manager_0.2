"use client";

type FileUploadCardProps = {
  acceptedLabel: string;
  description: string;
  files: File[];
  label: string;
  onFilesChange: (files: File[]) => void;
};

export function FileUploadCard({
  acceptedLabel,
  description,
  files,
  label,
  onFilesChange,
}: FileUploadCardProps) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    onFilesChange([...files, ...nextFiles]);
    event.target.value = "";
  }

  function handleRemoveFile(targetIndex: number) {
    onFilesChange(files.filter((_, index) => index !== targetIndex));
  }

  return (
    <div className="rounded-[24px] border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {acceptedLabel}
        </span>
      </div>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-accent/30 bg-[linear-gradient(135deg,rgba(15,108,189,0.06),rgba(255,255,255,0.95))] px-5 py-7 text-center transition hover:border-accent/55 hover:bg-[linear-gradient(135deg,rgba(15,108,189,0.1),rgba(255,255,255,1))]">
        <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink shadow-sm">
          {files.length > 0 ? "Add more files" : "Upload files"}
        </span>
        <span className="mt-4 text-sm font-medium text-ink">
          Click to keep adding documents to this onboarding packet
        </span>
        <span className="mt-2 text-xs leading-5 text-muted">
          Multiple files supported. Typical formats: PDF, JPG, PNG, DOCX.
        </span>
        <input
          multiple
          type="file"
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-4 space-y-2">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}`}
              className="flex items-center justify-between gap-3 rounded-2xl bg-panel-muted px-4 py-3 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{file.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted shadow-sm">
                  Ready
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="rounded-full border border-line bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted transition hover:border-accent hover:text-accent"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-panel-muted px-4 py-3 text-sm text-muted">
            No files selected yet.
          </div>
        )}
      </div>
    </div>
  );
}
