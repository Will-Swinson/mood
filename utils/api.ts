function createURL(path: string) {
  return window.location.origin + path;
}

export async function createNewEntry() {
  const response = await fetch(
    new Request(createURL("/api/journal"), {
      method: "POST",
    })
  );

  if (response.ok) {
    const data = await response.json();
    console.log("DATA OBJECT:", data);
    return data.data;
  }
}

export async function updateEntry(id: string, content: string) {
  try {
    const res = await fetch(
      new Request(createURL(`/api/journal/${id}`), {
        method: "PUT",
        body: JSON.stringify({ content }),
      })
    );

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {
    console.log(e);
  }
}
