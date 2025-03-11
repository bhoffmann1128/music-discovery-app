import parse from 'html-react-parser'

export default function GridComponent({numColumns=2, columnData}){
    
    return (
        <div className="block md:flex items-start justify-start">
            {columnData.map((column, index) => (
                <div key={index} className="w-full md:w-[50%] p-4">
                    {parse(column.grid_content)}
                </div>
            ))}
        </div>
    )
}