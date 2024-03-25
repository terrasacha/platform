import NewHeaderNavbar from "components/common/NewHeaderNavbar";

export default function Dashboard(props) {
  return (
    <div classname="container-sm container mx-auto sm:px-4">
      <div className="mb-5">
        <NewHeaderNavbar></NewHeaderNavbar>
      </div>
      <div classname="d-flex justify-center flex">
        <iframe
          title="lookerstudio dashboard"
          width="1800"
          height="900"
          src="https://lookerstudio.google.com/embed/reporting/91cf20ab-b74a-48cb-821f-1db47763699f/page/NawjD"
          frameborder="0"
          style={{ border: 0 }}
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
}
