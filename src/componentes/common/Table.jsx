export default function Table({ columns, data, loading, emptyMessage = 'Sin resultados' }) {
  if (loading) return <div className="table-loading">Cargando...</div>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data?.length ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
