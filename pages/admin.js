export async function getServerSideProps(context) {

    return {
        redirect: {
          permanent: false,
          destination: "http://admin.abreakmusic.com",
        },
        props:{},
      };

}

export default function Page() {

    return (
        <>
        <h2>you do not have permissions to view this page</h2>
        </>
    )

}