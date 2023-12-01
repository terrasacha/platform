import NewHeaderNavbar from "components/common/NewHeaderNavbar";

export default function Dashboard(props) {
  return (
    <div className="container-sm">
      <div className="mb-5">
        <NewHeaderNavbar></NewHeaderNavbar>
      </div>
      <div className="my-2">-</div>
      <div className="d-flex justify-center">
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
