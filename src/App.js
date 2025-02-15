// App.js
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import GlobalStyles from "./GlobalStyles";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.body};
  transition: all 0.3s ease;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
  font-weight: 600;
`;

const ThemeToggle = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.buttonShadow};
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.cardShadow};
  margin-bottom: 2.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 2px solid ${({ theme }) => theme.inputBorder};
  border-radius: 10px;
  font-size: 1rem;
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
    outline: none;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    top: -10px;
    left: 10px;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.primary};
  }
`;

const Label = styled.label`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.cardBg};
  padding: 0 0.5rem;
  color: ${({ theme }) => theme.textSecondary};
  pointer-events: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
`;

const Button = styled.button`
  padding: 0.9rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.buttonShadow};
  }

  &.primary {
    background: ${({ theme }) => theme.primary};
    color: white;
  }

  &.secondary {
    background: ${({ theme }) => theme.secondary};
    color: white;
  }

  &.danger {
    background: ${({ theme }) => theme.danger};
    color: white;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  margin-top: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
`;

const TableHeader = styled.th`
  padding: 1.25rem;
  text-align: left;
  background: ${({ theme }) => theme.tableHeaderBg};
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid ${({ theme }) => theme.border};

  &:hover {
    background: ${({ theme }) => theme.tableHeaderHover};
  }
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;

  &:nth-child(even) {
    background: ${({ theme }) => theme.tableRowEven};
  }

  &:hover {
    background: ${({ theme }) => theme.tableRowHover};
  }
`;

const TableCell = styled.td`
  padding: 1.25rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
    color: ${({ theme }) => theme.primary};
  }
`;

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
    location: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedCustomers = useMemo(() => {
    if (!sortConfig.key) return customers;

    return [...customers].sort((a, b) => {
      const valueA = a[sortConfig.key].toLowerCase();
      const valueB = b[sortConfig.key].toLowerCase();

      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [customers, sortConfig]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      ...formData,
      email: formData.email.trim() || "N/A",
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      requirement: formData.requirement.trim(),
      location: formData.location.trim(),
    };

    if (!newCustomer.name || !newCustomer.phone || !newCustomer.location)
      return;

    setCustomers((prev) =>
      editIndex !== null
        ? prev.map((c, i) => (i === editIndex ? newCustomer : c))
        : [...prev, newCustomer]
    );
    setFormData({
      name: "",
      email: "",
      phone: "",
      requirement: "",
      location: "",
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const customer = customers[index];
    setFormData({
      ...customer,
      email: customer.email === "N/A" ? "" : customer.email,
    });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setCustomers((prev) => prev.filter((_, i) => i !== index));
    if (index === editIndex) setEditIndex(null);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const data = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      setCustomers(
        data.map((c) => ({
          ...c,
          email: c.email?.trim() || "N/A",
          phone: c.phone?.toString() || "",
        }))
      );
    };

    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(customers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Container>
        <Header>
          <Title>Customer Management</Title>
          <ThemeToggle onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </ThemeToggle>
        </Header>

        <FormCard>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              {Object.keys(formData).map((field) => (
                <InputGroup key={field}>
                  <Input
                    type={field === "email" ? "email" : "text"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder=" "
                    required={field !== "email"}
                  />
                  <Label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                </InputGroup>
              ))}
            </FormGrid>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button type="submit" className="primary">
                {editIndex !== null ? "✏️ Update Customer" : "➕ Add Customer"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    requirement: "",
                    location: "",
                  });
                  setEditIndex(null);
                }}
                className="secondary"
              >
                🆕 New Entry
              </Button>
            </div>
          </form>
        </FormCard>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem" }}>
          <Button as="label" className="secondary">
            📁 Import Excel
            <input
              type="file"
              onChange={handleImport}
              hidden
              accept=".xlsx, .xls"
            />
          </Button>
          <Button
            className="primary"
            onClick={handleExport}
            disabled={!customers.length}
          >
            📤 Export Excel
          </Button>
          <Button
            className="danger"
            onClick={() => setCustomers([])}
            disabled={!customers.length}
          >
            🗑️ Clear All
          </Button>
        </div>

        {customers.length > 0 ? (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  {Object.keys(formData).map((key) => (
                    <TableHeader
                      key={key}
                      onClick={() =>
                        setSortConfig((prev) => ({
                          key,
                          direction:
                            prev.key === key && prev.direction === "asc"
                              ? "desc"
                              : "asc",
                        }))
                      }
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortConfig.key === key &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </TableHeader>
                  ))}
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    {Object.values(customer).map((value, i) => (
                      <TableCell key={i}>{value || "N/A"}</TableCell>
                    ))}
                    <TableCell>
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <ActionButton onClick={() => handleEdit(index)}>
                          ✏️
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(index)}>
                          🗑️
                        </ActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: darkMode ? "#a0aec0" : "#718096",
              fontSize: "1.1rem",
            }}
          >
            <p>
              No customers found. Start by adding new entries or importing data.
            </p>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
