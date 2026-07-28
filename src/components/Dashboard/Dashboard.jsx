import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import {
  listMarketplaces,
  listProducts,
  listProperties,
  listUserProducts,
  listUsers,
} from "graphql/queries";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import TerrasachaLogo from "components/common/TerrasachaLogo";

const TERRASACHA_COLORS = {
  primary: "#6e6c35",
  secondaryDark: "#44482c",
  secondary: "#849b50",
  secondaryLight: "#b1c181",
  earth: "#e8d79a",
  background: "#f6f5eb",
  white: "#ffffff",
  danger: "#b45309",
  success: "#849b50",
  neutral: "#94a3b8",
};

const APPS_BRIEF_URL =
  "https://52w4ayglef.execute-api.us-east-1.amazonaws.com/dev/get-apps-brief";

const formatNumber = (value) =>
  new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(
    value || 0
  );

const toTitleCase = (value) => {
  if (!value) return "Sin definir";
  return value
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeProjectStatus = (product) => {
  const status = product?.status?.toLowerCase();

  if (status === "draft") return "Borrador";
  if (status === "active") return "Activo";
  if (status === "inactive") return "Inactivo";
  if (status === "completed") return "Finalizado";
  if (status) return toTitleCase(status);
  if (product?.isActiveOnPlatform) return "En plataforma";
  if (product?.isActive) return "Activo";
  return "Sin definir";
};

const normalizePropertyStatus = (status) => {
  if (!status) return "Pendiente";

  const propertyStatusMap = {
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
    PENDING: "Pendiente",
    DOC_UPLOADED: "Documentado",
    SELECTABLE: "Elegible",
    NOT_SELECTABLE: "No seleccionable",
    ELEGIBLE: "Elegible",
  };

  return propertyStatusMap[status] || toTitleCase(status);
};

const getLatestDeployTime = (app) => {
  const branches = Array.isArray(app?.branches) ? app.branches : [];
  const deployTimes = branches
    .map((branch) => branch?.lastDeployTime)
    .filter(Boolean)
    .map((dateValue) => new Date(dateValue).getTime())
    .filter((time) => !Number.isNaN(time));

  if (deployTimes.length === 0) return null;
  return new Date(Math.max(...deployTimes));
};

const isAppAtRisk = (app) => {
  const latestDeployTime = getLatestDeployTime(app);
  const domainInfo = Array.isArray(app?.domainInfo) ? app.domainInfo : [];
  const hasReachableDomain = domainInfo.some((domain) => domain?.domainName);

  if (!latestDeployTime) return true;
  if (!hasReachableDomain) return true;

  const daysSinceDeploy =
    (Date.now() - latestDeployTime.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceDeploy > 30;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl border px-4 py-3 shadow-lg"
      style={{
        backgroundColor: TERRASACHA_COLORS.white,
        borderColor: `${TERRASACHA_COLORS.secondaryLight}55`,
      }}
    >
      <p
        className="mb-1 text-sm font-semibold font-typographica"
        style={{ color: TERRASACHA_COLORS.secondaryDark }}
      >
        {payload[0].name}
      </p>
      <p
        className="mb-0 text-sm font-typographica"
        style={{ color: TERRASACHA_COLORS.primary }}
      >
        {formatNumber(payload[0].value)}
      </p>
    </div>
  );
};

const getSoftBackground = (accentColor) => `${accentColor}14`;
const getSoftBorder = (accentColor) => `${accentColor}33`;

const MetricCard = ({ title, value, subtitle, accentColor }) => (
  <div
    className="group relative overflow-hidden rounded-[26px] border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    style={{
      borderColor: getSoftBorder(accentColor),
      background: `linear-gradient(145deg, ${TERRASACHA_COLORS.white} 0%, ${getSoftBackground(
        accentColor
      )} 100%)`,
    }}
  >
    <div
      className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-90"
      style={{ backgroundColor: `${accentColor}20` }}
    />
    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p
          className="mb-2 text-xs uppercase tracking-[0.18em] font-champagne"
          style={{ color: TERRASACHA_COLORS.secondaryDark }}
        >
          {title}
        </p>
        <p
          className="mb-1 text-3xl font-bold font-champagne lg:text-[2rem]"
          style={{ color: TERRASACHA_COLORS.primary }}
        >
          {formatNumber(value)}
        </p>
        <p
          className="mb-0 text-sm font-typographica"
          style={{ color: TERRASACHA_COLORS.secondaryDark }}
        >
          {subtitle}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="h-10 w-[3px] rounded-full"
          style={{ backgroundColor: `${accentColor}55` }}
        />
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, subtitle, action, children }) => (
  <section
    className="rounded-3xl border bg-white p-6 shadow-sm"
    style={{ borderColor: `${TERRASACHA_COLORS.secondaryLight}44` }}
  >
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h2
          className="mb-1 text-xl font-bold font-champagne"
          style={{ color: TERRASACHA_COLORS.primary }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className="mb-0 text-sm font-typographica"
            style={{ color: TERRASACHA_COLORS.secondaryDark }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const SummaryPill = ({ label, value }) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
    <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-white/65 font-champagne">
      {label}
    </p>
    <p className="mb-0 text-xl font-bold text-white font-champagne">
      {formatNumber(value)}
    </p>
  </div>
);

const EmptyState = ({ message }) => (
  <div
    className="rounded-2xl border border-dashed px-4 py-10 text-center"
    style={{
      borderColor: `${TERRASACHA_COLORS.secondaryLight}66`,
      backgroundColor: TERRASACHA_COLORS.background,
    }}
  >
    <p
      className="mb-0 text-sm font-typographica"
      style={{ color: TERRASACHA_COLORS.secondaryDark }}
    >
      {message}
    </p>
  </div>
);

const fetchAllPages = async (query, rootKey, variables = {}) => {
  let nextToken;
  const items = [];

  do {
    const response = await API.graphql(
      graphqlOperation(query, {
        ...variables,
        limit: 500,
        nextToken,
      })
    );

    const page = response?.data?.[rootKey];
    items.push(...(page?.items || []));
    nextToken = page?.nextToken;
  } while (nextToken);

  return items;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardState, setDashboardState] = useState({
    loading: true,
    loadErrors: [],
    appsLoadError: null,
    products: [],
    users: [],
    userProducts: [],
    properties: [],
    marketplaces: [],
    apps: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setDashboardState((currentState) => ({
        ...currentState,
        loading: true,
        loadErrors: [],
        appsLoadError: null,
      }));

      const [
        productsResult,
        usersResult,
        userProductsResult,
        propertiesResult,
        marketplacesResult,
        appsResult,
      ] = await Promise.allSettled([
        fetchAllPages(listProducts, "listProducts"),
        fetchAllPages(listUsers, "listUsers"),
        fetchAllPages(listUserProducts, "listUserProducts"),
        fetchAllPages(listProperties, "listProperties"),
        fetchAllPages(listMarketplaces, "listMarketplaces"),
        fetch(APPS_BRIEF_URL).then(async (response) => {
          if (!response.ok) {
            throw new Error("No fue posible consultar el estado de las apps.");
          }
          return response.json();
        }),
      ]);

      if (!isMounted) return;

      const loadErrors = [
        productsResult.status === "rejected"
          ? "No se pudieron cargar los proyectos."
          : null,
        usersResult.status === "rejected"
          ? "No se pudieron cargar los usuarios."
          : null,
        userProductsResult.status === "rejected"
          ? "No se pudieron cargar las asignaciones."
          : null,
        propertiesResult.status === "rejected"
          ? "No se pudieron cargar los predios."
          : null,
        marketplacesResult.status === "rejected"
          ? "No se pudieron cargar los marketplaces."
          : null,
      ].filter(Boolean);

      setDashboardState({
        loading: false,
        loadErrors,
        appsLoadError:
          appsResult.status === "rejected" ? appsResult.reason?.message : null,
        products:
          productsResult.status === "fulfilled" ? productsResult.value : [],
        users: usersResult.status === "fulfilled" ? usersResult.value : [],
        userProducts:
          userProductsResult.status === "fulfilled"
            ? userProductsResult.value
            : [],
        properties:
          propertiesResult.status === "fulfilled" ? propertiesResult.value : [],
        marketplaces:
          marketplacesResult.status === "fulfilled"
            ? marketplacesResult.value
            : [],
        apps: appsResult.status === "fulfilled" ? appsResult.value : [],
      });
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    loading,
    loadErrors,
    appsLoadError,
    products,
    users,
    userProducts,
    properties,
    marketplaces,
    apps,
  } = dashboardState;

  const {
    totalProducts,
    activeProducts,
    draftProducts,
    platformProducts,
    consultants,
    analysts,
    legals,
    marketplaceAdmins,
    platformAdmins,
    productsWithoutConsultant,
    productsWithoutAnalyst,
    propertiesWithoutLegal,
    projectStatusData,
    propertyStatusData,
    appsAtRisk,
    totalPendingAssignments,
  } = useMemo(() => {
    const consultantUsers = users.filter((user) => user.role === "validator");
    const analystUsers = users.filter((user) => user.role === "analyst");
    const legalUsers = users.filter((user) => user.role === "legal");
    const marketplaceAdminUsers = users.filter(
      (user) => user.role === "admon" && user.marketplaceID
    );
    const platformAdminUsers = users.filter(
      (user) => user.role === "admon" && !user.marketplaceID
    );

    const assignmentMap = userProducts.reduce((accumulator, assignment) => {
      const productId = assignment?.productID;
      const userRole = assignment?.user?.role;

      if (!productId || !userRole) return accumulator;
      if (!accumulator[productId]) {
        accumulator[productId] = {
          validator: false,
          analyst: false,
        };
      }

      if (userRole === "validator") {
        accumulator[productId].validator = true;
      }

      if (userRole === "analyst") {
        accumulator[productId].analyst = true;
      }

      return accumulator;
    }, {});

    const productsMissingConsultant = products.filter(
      (product) => !assignmentMap[product.id]?.validator
    );

    const productsMissingAnalyst = products.filter(
      (product) => !assignmentMap[product.id]?.analyst
    );

    const unassignedProperties = properties.filter((property) => {
      const normalizedStatus = property?.status?.toUpperCase();
      const isClosedStatus =
        normalizedStatus === "APPROVED" || normalizedStatus === "REJECTED";
      return !property?.userLegalID && !isClosedStatus;
    });

    const projectStatusAccumulator = products.reduce((accumulator, product) => {
      const label = normalizeProjectStatus(product);
      accumulator[label] = (accumulator[label] || 0) + 1;
      return accumulator;
    }, {});

    const propertyStatusAccumulator = properties.reduce((accumulator, item) => {
      const label = normalizePropertyStatus(item?.status);
      accumulator[label] = (accumulator[label] || 0) + 1;
      return accumulator;
    }, {});

    const riskApps = apps.filter(isAppAtRisk);

    const projectStatusChartData = Object.entries(projectStatusAccumulator)
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value);

    const propertyStatusChartData = Object.entries(propertyStatusAccumulator)
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value);

    return {
      totalProducts: products.length,
      activeProducts: products.filter((product) => product?.isActive).length,
      draftProducts: products.filter(
        (product) => product?.status?.toLowerCase() === "draft"
      ).length,
      platformProducts: products.filter(
        (product) => product?.isActiveOnPlatform
      ).length,
      consultants: consultantUsers,
      analysts: analystUsers,
      legals: legalUsers,
      marketplaceAdmins: marketplaceAdminUsers,
      platformAdmins: platformAdminUsers,
      productsWithoutConsultant: productsMissingConsultant,
      productsWithoutAnalyst: productsMissingAnalyst,
      propertiesWithoutLegal: unassignedProperties,
      projectStatusData: projectStatusChartData,
      propertyStatusData: propertyStatusChartData,
      appsAtRisk: riskApps,
      totalPendingAssignments:
        productsMissingConsultant.length +
        productsMissingAnalyst.length +
        unassignedProperties.length,
    };
  }, [apps, products, properties, userProducts, users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-terrasacha-subtle font-typographica">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
                style={{
                  borderColor: `${TERRASACHA_COLORS.secondaryLight}55`,
                  borderTopColor: TERRASACHA_COLORS.primary,
                }}
              />
              <p
                className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] font-champagne"
                style={{ color: TERRASACHA_COLORS.secondaryDark }}
              >
                Cargando dashboard administrativo
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasCriticalLoadError =
    loadErrors.length > 0 &&
    totalProducts === 0 &&
    users.length === 0 &&
    properties.length === 0;

  if (hasCriticalLoadError) {
    return (
      <div className="min-h-screen bg-gradient-terrasacha-subtle font-typographica">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl border bg-white p-8 shadow-lg"
            style={{ borderColor: `${TERRASACHA_COLORS.earth}66` }}
          >
            <h1
              className="mb-3 text-2xl font-bold font-champagne"
              style={{ color: TERRASACHA_COLORS.primary }}
            >
              No fue posible cargar el dashboard
            </h1>
            <p
              className="mb-4 text-sm font-typographica"
              style={{ color: TERRASACHA_COLORS.secondaryDark }}
            >
              Hubo un problema consultando la informaci&oacute;n administrativa.
            </p>
            <ul
              className="mb-6 list-disc pl-5 text-sm font-typographica"
              style={{ color: TERRASACHA_COLORS.secondaryDark }}
            >
              {loadErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: TERRASACHA_COLORS.primary }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-terrasacha-subtle font-typographica">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section
          className="overflow-hidden rounded-[28px] border shadow-lg"
          style={{
            borderColor: `${TERRASACHA_COLORS.secondaryLight}44`,
            background: `linear-gradient(135deg, ${TERRASACHA_COLORS.secondaryDark} 0%, ${TERRASACHA_COLORS.primary} 42%, ${TERRASACHA_COLORS.secondary} 100%)`,
          }}
        >
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <TerrasachaLogo className="h-auto w-40 brightness-200 contrast-125" />
                </div>
              </div>
              <p className="mb-2 text-sm uppercase tracking-[0.24em] text-white/70 font-champagne">
                Centro de control administrativo
              </p>
              <h1 className="mb-3 text-3xl font-bold text-white font-champagne lg:text-4xl">
                Inicio de Administraci&oacute;n
              </h1>
              <p className="mb-6 max-w-2xl text-sm leading-6 text-white/85 lg:text-base">
                Una experiencia ejecutiva y visualmente refinada para priorizar
                asignaciones, entender el estado operativo de Terrasacha y
                entrar con claridad a cada frente de gesti&oacute;n.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryPill label="Proyectos" value={totalProducts} />
                <SummaryPill
                  label="Pendientes cr&iacute;ticos"
                  value={totalPendingAssignments}
                />
                <SummaryPill label="Apps con riesgo" value={appsAtRisk.length} />
              </div>
            </div>

            <div
              className="rounded-3xl border bg-white/10 p-6 backdrop-blur-sm"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="mb-4 text-sm uppercase tracking-[0.18em] text-white/70 font-champagne">
                Foco del d&iacute;a
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="mb-1 text-xs text-white/70">
                    Cobertura operativa por resolver
                  </p>
                  <p className="mb-2 text-3xl font-bold text-white font-champagne">
                    {formatNumber(
                      productsWithoutConsultant.length +
                        productsWithoutAnalyst.length +
                        propertiesWithoutLegal.length
                    )}
                  </p>
                  <p className="mb-0 text-sm text-white/75 font-typographica">
                    Pendientes combinados entre proyectos, an&aacute;lisis y
                    frente legal.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="mb-1 text-xs text-white/70">Predios</p>
                    <p className="mb-0 text-2xl font-bold text-white font-champagne">
                      {formatNumber(properties.length)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="mb-1 text-xs text-white/70">Marketplaces</p>
                    <p className="mb-0 text-2xl font-bold text-white font-champagne">
                      {formatNumber(marketplaces.length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loadErrors.length > 0 || appsLoadError ? (
          <div
            className="rounded-2xl border px-5 py-4"
            style={{
              backgroundColor: `${TERRASACHA_COLORS.earth}33`,
              borderColor: `${TERRASACHA_COLORS.earth}99`,
            }}
          >
            <p
              className="mb-2 text-sm font-semibold font-typographica"
              style={{ color: TERRASACHA_COLORS.secondaryDark }}
            >
              Algunas fuentes de datos no se cargaron por completo
            </p>
            <ul
              className="mb-0 list-disc pl-5 text-sm font-typographica"
              style={{ color: TERRASACHA_COLORS.secondaryDark }}
            >
              {loadErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
              {appsLoadError ? <li>{appsLoadError}</li> : null}
            </ul>
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Proyectos activos"
            value={activeProducts}
            subtitle="Proyectos marcados como activos en el sistema."
            accentColor={TERRASACHA_COLORS.primary}
          />
          <MetricCard
            title="Publicados"
            value={platformProducts}
            subtitle="Visibles o activos en plataforma."
            accentColor={TERRASACHA_COLORS.secondary}
          />
          <MetricCard
            title="Borradores"
            value={draftProducts}
            subtitle="Proyectos que a&uacute;n no salen del estado draft."
            accentColor={TERRASACHA_COLORS.earth}
          />
          <MetricCard
            title="Admins marketplace"
            value={marketplaceAdmins.length}
            subtitle={`${platformAdmins.length} admin(s) de plataforma sin marketplace vinculado.`}
            accentColor={TERRASACHA_COLORS.secondaryLight}
          />
          <MetricCard
            title="Consultores"
            value={consultants.length}
            subtitle={`${productsWithoutConsultant.length} proyecto(s) sin cobertura.`}
            accentColor={TERRASACHA_COLORS.primary}
          />
          <MetricCard
            title="Analistas"
            value={analysts.length}
            subtitle={`${productsWithoutAnalyst.length} proyecto(s) por asignar.`}
            accentColor={TERRASACHA_COLORS.secondaryDark}
          />
          <MetricCard
            title="Legales"
            value={legals.length}
            subtitle={`${propertiesWithoutLegal.length} predio(s) sin responsable.`}
            accentColor={TERRASACHA_COLORS.secondary}
          />
          <MetricCard
            title="Apps en riesgo"
            value={appsAtRisk.length}
            subtitle={`${formatNumber(apps.length)} aplicaci&oacute;n(es) monitoreadas desde el dashboard.`}
            accentColor={TERRASACHA_COLORS.earth}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SectionCard
            title="Estado de proyectos"
            subtitle="Panor&aacute;mica por estado interno del proyecto."
          >
            {projectStatusData.length ? (
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d6d8c4" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: TERRASACHA_COLORS.secondaryDark, fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: TERRASACHA_COLORS.secondaryDark, fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      radius={[10, 10, 0, 0]}
                      fill={TERRASACHA_COLORS.primary}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState message="No hay proyectos para graficar." />
            )}
          </SectionCard>

          <SectionCard
            title="Pipeline de predios"
            subtitle="Estado de validaci&oacute;n y avance de los predios registrados."
          >
            {propertyStatusData.length ? (
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d6d8c4" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: TERRASACHA_COLORS.secondaryDark, fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: TERRASACHA_COLORS.secondaryDark, fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      radius={[10, 10, 0, 0]}
                      fill={TERRASACHA_COLORS.secondaryDark}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState message="No hay predios para graficar." />
            )}
          </SectionCard>
        </div>

        <div className="flex justify-end">
          <Link
            to="/admon?tab=products"
            className="rounded-xl px-5 py-3 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: TERRASACHA_COLORS.secondaryDark }}
          >
            Ir al panel operativo
          </Link>
        </div>
      </div>
    </div>
  );
}
