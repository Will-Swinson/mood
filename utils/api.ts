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

export async function askQuestion(question: string) {
  try {
    // Make a fetch request to the question endpoint
    const res = await fetch("/api/question", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    // If the response is good then we will get back the question data
    if (res.ok) {
      // Parse the response
      const data = await res.json();
      // Because the data is nested in the data object we have to return that data.data
      return data.data;
    }
  } catch (e) {
    console.log(e.message);
  }
}
