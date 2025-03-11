export async function getServerSideProps(context) {

    return {
        redirect: {
          permanent: false,
          destination: "http://abreakmusic.wpengine.com/wp-admin",
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