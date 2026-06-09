import { useEffect, useState } from "react";
import { supabase } from "./servicios/supabase";

function App() {

  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {

    const cargarPeliculas = async () => {

      const { data, error } = await supabase
        .from('peliculas')
        .select('*');

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (!error) {
        setPeliculas(data);
      }
    };

    cargarPeliculas();

  }, []);

  return (
    <div>
      <h1>Películas</h1>

      {peliculas.map((p) => (
        <div key={p.id}>
          <h3>{p.titulo}</h3>
          <p>{p.director}</p>
          <p>{p.anio}</p>
        </div>
      ))}
    </div>
  );
}

export default App;