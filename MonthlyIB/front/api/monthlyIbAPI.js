const monthlyIBThumbail = async (monthlyIbId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/monthly-ib/monthly-ib-thumbnail/${monthlyIbId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ image: image }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

const monthlyIBRevise = async (monthlyIbId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/monthly-ib/${monthlyIbId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
        body: JSON.stringify({ title, content: "dummy" }),
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

const monthlyIBGetSingleItem = async (monthlyIbId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/monthly-ib/${monthlyIbId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

const monthlyIBDeleteItem = async (monthlyIbId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/monthly-ib/${monthlyIbId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};

const monthlyIBGetList = async (keyWord) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/monthly-ib/list?keyWord=${keyWord}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken,
        },
      }
    );
    if (res.ok) {
      console.log("success");
    }
  } catch (error) {
    console.error(error);
  }
};
