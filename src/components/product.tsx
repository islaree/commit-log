export const Product = ({data}: {data: any}) => {

    return (
        <>
            <div className="mt-10 text-4xl font-bold">
                {data.name}
            </div>
        </>
    )
}