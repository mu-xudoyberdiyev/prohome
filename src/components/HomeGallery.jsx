export default function HomeGallery() {
  return (
    <div className="grid grid-cols-2 gap-2 w-full my-4">
      <img
        className="object-cover h-60 w-full border rounded"
        src="/2d.jpg"
        alt="2d"
      />

      <img
        className="object-cover h-60 w-full border rounded"
        src="/3d.jpg"
        alt="3d"
      />
    </div>
  );
}
